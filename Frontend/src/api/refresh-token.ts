import axios, { AxiosError  } from "axios";
import { getAccessToken } from ".";
import { signOutUser } from "../actions/index";
type Subscriber = (accessToken: string) => void;

let isAlreadyFetchingAccessToken = false;

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [] as Subscriber[];

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    registerRequestInterceptor: (store: any) => {
        // const instace = axios.create();

        axios.interceptors.response.use(
            // If the request succeeds, we don't have to do anything and just return the response
            response => {
                console.log("Interceptor - response:", response)
                return response;
            },
            error => {
                console.log(error)
                const errorResponse = error.response;
                console.log("Interceptor - err:", errorResponse)

                if (!errorResponse.data && !errorResponse.status) {
                    return resetTokenAndReattemptRequest(error, store);
                } else if( errorResponse.data ) {
                    if (isRefreshTokenExpiredError(errorResponse.data)) {
                        store.dispatch(signOutUser());
                    }
                    if (isTokenExpiredError(errorResponse.data)) {
                        return resetTokenAndReattemptRequest(error, store);
                    }
                    if (isTokenInvalidError(errorResponse.data)) {
                        store.dispatch(signOutUser());
                    }
                }  

                // If the error is due to other reasons, we just throw it back to axios
                return Promise.reject({
                    ...error,
                    status: errorResponse.status
                })
            }
        );

        axios.interceptors.request.use(
            config => {
                config.headers['Access-Control-Allow-Origin'] = '*'
                config.headers['Authorization'] = `Bearer ${getAccessToken()}`
                return config
            }
        )
    }
}

function isTokenExpiredError(
    errorMessage: string
): boolean {
    return errorMessage.includes("TokenExpiredError");
}

function isTokenInvalidError(
    errorMessage: string
): boolean {
    return errorMessage.includes("JsonWebTokenError") || errorMessage.includes("EmptyToken");
}

function isRefreshTokenExpiredError(
    errorMessage: string
): boolean {
    return errorMessage.includes("NotAuthorizedException");
}

function getResetToken(): string | null {
    return localStorage.getItem("refreshToken");
}

function refreshLocalStorage(response: any): void {
    localStorage.setItem("accessToken", response.accessToken!);
    localStorage.setItem("expirationDate", new Date(
        new Date().getTime() + response.expiresIn! * 1000
    ).toString());
}

async function resetTokenAndReattemptRequest(error: AxiosError, store: any) {
    try {
        const { response: errorResponse } = error;
        const refreshToken = getResetToken();
        const accessToken = getAccessToken();
        if (!refreshToken || !accessToken) {
            // We can't refresh, throw the error anyway
            store.dispatch(signOutUser());
            return Promise.reject(error);
        }
        /* Proceed to the token refresh procedure
        We create a new Promise that will retry the request,
        clone all the request configuration from the failed
        request in the error object. */
        const retryOriginalRequest = new Promise(resolve => {
            /* We need to add the request retry to the queue
            since there another request that already attempt to
            refresh the token */
            addSubscriber(accessToken => {
                errorResponse!.config.headers.Authorization = 'Bearer ' + accessToken;
                resolve(axios(errorResponse!.config));
            });
        });
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            // const response = await getUserManagementAPI().refreshToken({ refreshToken });
            const response: any = {} // remove this the commented row is correct
            if (!response.data) {
                store.dispatch(signOutUser());
                return Promise.reject(error);
            }
            const newToken = response.data.accessToken;
            refreshLocalStorage(response.data);
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken!);
        }
        return retryOriginalRequest;
    } catch (err) {
        return Promise.reject(err);
    }
}

function onAccessTokenFetched(accessToken: string) {
    // When the refresh is successful, we start retrying the requests one by one and empty the queue
    subscribers.forEach(callback => callback(accessToken));
    subscribers = [];
}

function addSubscriber(callback: (accessToken: string) => void) {
    subscribers.push(callback);
}

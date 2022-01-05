import mock from "mock-require";
import { MockedWooCommerceResponse } from "../types";

class WooCommerceRestApi {

    get(url: string, options: { per_page: MockedWooCommerceResponse, offset: number }) {

        // tslint:disable:no-magic-numbers
        if (options && options.offset && options.offset === 99) {
            throw new Error("Unable to get products");
        }

        if (url.includes("variation")) {
            return {
                data: [
                    {
                        id: "234852",
                        attributes: [
                            {
                                option: "Gargan"
                            }
                        ]
                    },
                    {
                        id: "234852",
                        attributes: [
                            {
                                option: "Duki"
                            }
                        ]
                    }
                ]
            };
        }

        if (options.per_page === MockedWooCommerceResponse.noVariation) {
            return {
                headers: {
                    "x-wp-total": 5
                },
                data: [{
                    images: [
                        {
                            src: "www.site.com/picture.jpg"
                        }
                    ],
                    permalink: "www.site.com",
                    name: "my Product",
                    price: "123",
                    slug: "best",
                    variations: [],
                    attributes: [
                        {
                            "name": "Quantité",
                            "options": [
                                "30 capsules"
                            ]
                        }
                    ]
                }]
            };
        } else if (options.per_page === MockedWooCommerceResponse.variationManyAttributes) {
            return {
                headers: {
                    "x-wp-total": 5
                },
                data: [{
                    images: [
                        {
                            src: "www.site.com/picture.jpg"
                        }
                    ],
                    permalink: "www.site.com",
                    name: "my Product",
                    price: "123",
                    slug: "best",
                    variations: ["1", "2"],
                    attributes: [
                        {
                            "name": "Quantité",
                            "options": [
                                "30 capsules"
                            ]
                        }
                    ]
                }]
            };
        } else {
            return {
                headers: {
                    "x-wp-total": 5
                },
                data: [{
                    images: [
                        {
                            src: "www.site.com/picture.jpg"
                        }
                    ],
                    permalink: "www.site.com",
                    name: "my Product",
                    price: "123",
                    slug: "best",
                    variations: ["1", "2"],
                    attributes: [
                        {
                            "name": "Quantité",
                            "options": [
                                "30 capsules"
                            ]
                        },
                        {
                            "name": "Color",
                            "options": [
                                "Green"
                            ]
                        }
                    ]
                }]
            };
        }


    }
}

mock("@woocommerce/woocommerce-rest-api", WooCommerceRestApi);

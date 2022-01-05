import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { ExaminationTable } from "./examination";

interface PatientEntity {
    id: string;
    email: string;
    name: string;
    surname: string;
    petId: string;
}

class PatientTable extends Model<PatientEntity> implements PatientEntity {
    public id!: string;
    public email!: string;
    public name!: string;
    public surname!: string;
    public petId!: string;
}

PatientTable.init(
    {
        id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        name: {
            type: DataTypes.CHAR(30),
            allowNull: false,
        },
        surname: {
            type: DataTypes.CHAR(30),
            allowNull: false,
        },
        petId: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: "Patient",
        timestamps: true
    }
);

PatientTable.hasMany(ExaminationTable, {
    foreignKey: "patientId",
    as: "patient",
    hooks: true,
    onDelete: 'CASCADE',
    onUpdate: "CASCADE",
});

ExaminationTable.belongsTo(PatientTable, {
    foreignKey: "patientId",
    as: "patient",
    onDelete: 'CASCADE',
});
ExaminationTable.sync()
PatientTable.sync()
export { PatientTable, PatientEntity };

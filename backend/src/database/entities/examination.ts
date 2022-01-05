
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

interface ExaminationEntity {
    id: string;
    examinationNumber: string;
    createdAt: Date;
    updatedAt: Date;
    patientId?: string;
}

class ExaminationTable extends Model<ExaminationEntity> implements ExaminationTable {
    public id!: string;
    public examinationNumber!: string;
    public createdAt!: Date
    public updatedAt!: Date
}

ExaminationTable.init(
    {
        id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            primaryKey: true
        },
        examinationNumber: {
            type: DataTypes.CHAR(100),
            allowNull: false,
            unique: true
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        tableName: "Examination",
        timestamps:false
    }
);
// ExaminationTable.sync()
export { ExaminationTable, ExaminationEntity };

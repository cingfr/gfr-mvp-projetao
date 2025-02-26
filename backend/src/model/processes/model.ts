import { DataTypes } from 'sequelize'
import { sequelize } from '../db'

export const ProcessModel = sequelize.define('PROCESSES', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    detalhes: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastModified: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    didBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

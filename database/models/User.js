module.exports = (sequelize, dataTypes) => {
    const alias = "Users";
    const cols = {
        id: {
            autoincrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        first_name: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        alias: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        avatar_id: {
            type: dataTypes.STRING,
            allowNull: false
        }
    };
    const config = {
        tableName: "user", //nombre real de la tabla en la BD
        timestamps: false
    };

    const User = sequelize.define(alias, cols, config);

   /*  User.associate = (models) => {
        User.belongsTo(models.Sexos, {
            foreignKey: 'avatar_id',
            as: 'sexo'
        });
    } */
    return User;
}
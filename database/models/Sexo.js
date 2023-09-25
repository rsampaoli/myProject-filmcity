module.exports = (sequelize, dataTypes) => {
    const alias = "Sexos";
    const cols = {
        id: {
            autoincrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        sexo: {
            type: dataTypes.STRING,
            allowNull: false,

        }
    }
    const config = {
        tableName: "sexo", //nombre real de la tabla en la BD
        timestamps: false
    };

    const Sexo = sequelize.define(alias, cols, config);

    Sexo.associate = (models) => {
        Sexo.hasMany(models.Users, {
            foreignKey: 'avatar_id',
            as: 'users'
        });
    }
    return Sexo;
}
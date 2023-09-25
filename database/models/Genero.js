module.exports = (sequelize, dataTypes) => {
    const alias = "Generos";
    const cols = {
        id: {
            autoincrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        tipo: {
            type: dataTypes.STRING,
            allowNull: false,

        }
    }
    const config = {
        tableName: "genero", //nombre real de la tabla en la BD
        timestamps: false
    };

    const Genero = sequelize.define(alias, cols, config);

    /* Genero.associate = (models) => {
        Genero.hasMany(models.Peliculas, {
            foreignKey: 'genero_id',
            as: 'peliculas'
        });
    } */
    return Genero;
}    
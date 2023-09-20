module.exports = (sequelize, dataTypes) => {
    const alias = "Peliculas";
    const cols = {
        ID: {
            autoincrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        nombre: {
            allowNull: false,
            type: dataTypes.STRING,
        }
    };
    const config = {
        tableName: "pelicula", //nombre real de la tabla en la BD
        timestamps: false
    };

    const Pelicula = sequelize.define(alias, cols, config);
    return Pelicula;
}    
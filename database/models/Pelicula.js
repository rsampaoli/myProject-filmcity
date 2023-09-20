module.exports = (sequelize, dataTypes) => {
    const alias = "Peliculas";
    const cols = {
        id: {
            autoincrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        nombre: {
            type: dataTypes.STRING,
            allowNull: false,
        }
    };
    const config = {
        tableName: "pelicula", //nombre real de la tabla en la BD
        timestamps: false
    };

    const Pelicula = sequelize.define(alias, cols, config);
    return Pelicula;
}    
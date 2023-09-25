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
        },
        rating: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        genero_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: dataTypes.STRING,
            allowNull: false
        }
    };
    const config = {
        tableName: "pelicula", //nombre real de la tabla en la BD
        timestamps: false
    };

    const Pelicula = sequelize.define(alias, cols, config);

    Pelicula.associate = (models) => {
        Pelicula.belongsTo(models.Generos, {
            foreignKey: 'genero_id',
            as: 'genero'
        });
    }
    return Pelicula;
}
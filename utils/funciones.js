function generarStringAleatorio() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let stringAleatorio = '';
    for (let i = 0; i < 10; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        stringAleatorio += caracteres.charAt(indiceAleatorio);
    }
    return stringAleatorio;
}

function obtenerRutaImagenPerfil(genero, randomNumber) {
    if (genero === 'mujer') {
        return `/images/users/women${randomNumber}.jpg`;
    } else if (genero === 'hombre') {
        return `/images/users/man${randomNumber}.jpg`;
    } else {
        return `/images/users/cat${randomNumber}.jpg`;
    }
}

module.exports = {
    generarStringAleatorio,
    obtenerRutaImagenPerfil
};
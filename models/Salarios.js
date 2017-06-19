const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const SalariosSchema   = new Schema({
    cd_ugestora: Number,
    de_ugestora: String,
    de_cargo: String,
    de_tipocargo: String,
    cd_cpf: String,
    dt_mesanorefencia: String,
    no_servidor: String,
    vl_vantagens: Number,
    de_uorcamentaria: String,
});

module.exports = mongoose.model('Salarios', SalariosSchema);
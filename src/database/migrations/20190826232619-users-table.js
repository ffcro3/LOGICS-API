module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'common',
      },
      imagem_usuario: {
        type: Sequelize.STRING,
        defaultValue:
          'http://www.mds.gov.br/webarquivos/arquivo/mds_pra_vc/botoes/Carta_de_Servi%C3%A7o__200x200_CIDADAO.png',
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};

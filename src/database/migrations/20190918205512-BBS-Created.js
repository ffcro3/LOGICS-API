module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      record_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assessment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_by:{
        type: Sequelize.STRING,
        allowNull: false
      },
      employee_permanent:{
        type: Sequelize.STRING,
      },
      employee_not_in_logics:{
        type: Sequelize.STRING,
      },
      crest_code: {
        type: Sequelize.STRING,
      },
      dhl_regions: {
        type: Sequelize.STRING,
      },
      dhl_sub_regions: {
        type: Sequelize.STRING,
      },
      dhl_sector: {
        type: Sequelize.STRING,
      },
      dhl_country_business_unit: {
        type: Sequelize.STRING,
      },
      dhl_country: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      type_observed: {
        type: Sequelize.STRING,
      },
      function: {
        type: Sequelize.STRING,
      },
      quesiton_location: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      question: {
        type: Sequelize.STRING,
      },
      at_risk: {
        type: Sequelize.STRING,
      },
      safe: {
        type: Sequelize.STRING,
      },
      observer_feedback: {
        type: Sequelize.STRING,
      },
      worker_feedback: {
        type: Sequelize.STRING,
      },
      comments: {
        type: Sequelize.STRING,
      },
      current_stage: {
        type: Sequelize.STRING,
      },
      task_observed: {
        type: Sequelize.STRING,
      },
      behavior: {
        type: Sequelize.STRING,
      },
      quesiton_mobile_app: {
        type: Sequelize.STRING,
      },
      safe_unsafe: {
        type: Sequelize.STRING,
      },
      cause_of_unsafe: {
        type: Sequelize.STRING,
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

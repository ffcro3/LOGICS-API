import Sequelize, { Model } from 'sequelize';

class BBS extends Model{
    static init(sequelize){
        super.init({
            RecordNo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            AssessmentDate: Sequelize.DATE,
            CreatedBy: Sequelize.STRING,
            EmployeePermanent: Sequelize.STRING,
            EmployeeNotInLogics: Sequelize.STRING,
            CrestCode: Sequelize.STRING,
            DHLRegions: Sequelize.STRING,
            DHLSubRegion: Sequelize.STRING,
            DHLSector: Sequelize.STRING,
            DHLCountryBusinessUnit: Sequelize.STRING,
            DHLCountry: Sequelize.STRING,
            Location: Sequelize.STRING,
            TypeObserved: Sequelize.STRING,
            Function: Sequelize.STRING,
            QuestionLocation: Sequelize.STRING,
            Category: Sequelize.STRING,
            Question: Sequelize.STRING,
            AtRisk: Sequelize.INTEGER,
            Safe: Sequelize.INTEGER,
            ObserverFeedback: Sequelize.STRING,
            WorkerFeedback: Sequelize.STRING,
            Comments: Sequelize.STRING,
            CurrentStage: Sequelize.STRING,
            TaskObserved: Sequelize.STRING,
            Behavior: Sequelize.STRING,
            Question: Sequelize.STRING,
            SafeUnsafe: Sequelize.STRING,
            CauseOfUnsafe: Sequelize.STRING,
        },
        {
            sequelize
        });
    }
    
}

export default BBS;
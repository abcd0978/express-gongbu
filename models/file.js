const Sequelize = require('sequelize');

module.exports = class File extends Sequelize.Model
{
    static init(sequelize)
    {
        return super.init({
            post_id:
            {
                type: Sequelize.INTEGER,
                allowNull:false,//댓글은 항상 특정 글에 속해있으므로 post_id는 null이 될수 없다
            },
            filepath://파일 경로(path안에 경로, 이름, 확장자 다 들어간다.)
            {
                type: Sequelize.STRING(300),
                allowNull:false,
            },
        },
        {
            sequelize,
            timestamps: true,//createdAt, createdAt row를 만들어줌.
            paranoid: true,//deletedAt일자 만들어줌(softdelete)
            modelName: 'File',//모델이름
            tableName: 'files',//테이블명 즉 sql에서 쓰는이름
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db)
    {
        db.File.belongsTo(db.Post,{foreignKey:'post_id', sourceKey:'post_id'});//file은 post에 속한다.
    }
}
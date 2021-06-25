const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model
{
    static init(sequelize)
    {
        return super.init({
            comment:
            {
                type: Sequelize.STRING(200),
                allowNull:false,
            },
        },
        {
            sequelize,
            timestamps: true,//생성한날짜, 업데이트한날짜 row를 만들어줌.
            paranoid: true,//deletedAt일자 만들어줌(softdelete)
            modelName: 'Comment',//모델이름
            tableName: 'comments',//테이블명 즉 sql에서 쓰는이름 
            charset: 'utf8',
            collate: 'utf8_general_ci',
        }
        )
    }
}
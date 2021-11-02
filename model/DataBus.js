class DataBus {

    static setUser({ctx, user, chat_id, access_token}) {
        ctx.session.user = {
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            lichnost_id: user.lichnost_id,
            user_id: user.user_id,
            chat_id: chat_id,
            access_token: access_token
        }
    }

    static getUser({ctx}) {
        return ctx.session.user
    }

}

module.exports = DataBus
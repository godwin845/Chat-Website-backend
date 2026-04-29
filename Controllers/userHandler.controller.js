import { searchUsers, getChatters } from "../services/user.service.js";

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || "";
        const currentUserID = req.user._id;

        const users = await searchUsers({
            search,
            currentUserID
        });

        res.status(200).send(users);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message || error
        });
    }
};


export const getCurrentChatters = async (req, res) => {
    try {
        const currentUserID = req.user._id;

        const users = await getChatters({
            currentUserID
        });

        res.status(200).send(users);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message || error
        });
    }
};
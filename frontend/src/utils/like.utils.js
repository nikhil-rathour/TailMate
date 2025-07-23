import axios from "axios"

const API_URL = `${import.meta.env.VITE_BACKEND}/api/likes`;

export const getAllLikePosts = async (id) => {
    try {
        console.log("get lliek", id)

        const res = await axios.get(`${API_URL}/list-all-likes/${id}`)
        // console.log(res)
        const data = res.data
        return data

    } catch (error) {
        console.log(error)
        throw new error
    }
}

export const createLike = async (userId, postId) => {
    try {
        const res = await axios.post(`${ API_URL }/add-like`, { userId, postId })
        return res.data
    } catch (error) {
        console.log(error)
        throw new error
    }
}

export const deleteLike = async (userId, postId) => {
    try {
        console.log("delete like", userId, postId);
        const res = await axios.delete(`${API_URL}/delete-like`, {
            data: { userId, postId }, // Correct way to send body in DELETE
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

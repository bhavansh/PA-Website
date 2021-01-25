const axios = require("axios");

exports.convertmarkdown = async (data) => {
    // console.log(JSON.stringify(data));
    const data1 = JSON.stringify(data);
    const senddata = `{"text":${data1}}`;
    // console.log(senddata);
    try {
        const config = {
            method: "post",
            url: "https://api.github.com/markdown",
            headers: {
                "Content-Type": "text/plain",
            },
            data: senddata,
        };
        const response = await axios(config);
        // console.log(response.data);
        return JSON.stringify(response.data);
    } catch (err) {
        console.log(err.data);
        return "Due to some error,The Page Couldn't be rendered";
    }
};

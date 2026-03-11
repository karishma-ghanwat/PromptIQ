// import 'dotenv/config';

// const getOpenaiResponse = async (message) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [
//                 {
//                     role: "user",
//                     content: message
//                 }
//             ]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         // console.log(data.choices[0].message.content);//reply from openai
//         return data.choices[0].message.content;
//     } catch (err) {
//         console.log(err);
//     }
// }

// export default getOpenaiResponse;
import 'dotenv/config';

const getOpenaiResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();

        // Debug: see full response
        console.log("OpenAI Response:", data);

        // Check if response contains choices
        if (data && data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error("Invalid OpenAI response:", data);
            return "Sorry, AI could not generate a reply.";
        }

    } catch (err) {
        console.error("OpenAI API Error:", err);
        return "Error connecting to AI service.";
    }
};

export default getOpenaiResponse;
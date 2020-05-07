import nextConnect from "next-connect";
import TextToSpeechV1 from "ibm-watson/text-to-speech/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import validator from "validator";

import rollbar from "../";

const handler = nextConnect();

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.SPEAK_KEY
  }),
  url: process.env.SPEAK_URL,
  headers: {
    "X-Watson-Learning-Opt-Out": "true"
  }
});

handler.post(async (req, res) => {
  try {
    const synthesizeParams = req.body;
    if (validator.isEmpty(req.body.text)) {
      throw new Error("You need to make a translation first");
    }
    const audio = await textToSpeech.synthesize(synthesizeParams);
    await audio.result.pipe(res);
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    rollbar.error(err);
  }
});

export default handler;

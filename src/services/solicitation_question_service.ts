import apiEndpoints from "@/constants/endpoints";
import { CustomException } from "@/helpers/errorHelper";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parseApplicationFromObject } from "@/models/Application";
import {
  ApplicationInfo,
  parseApplicationInfoFromObject,
} from "@/models/ApplicationInfo";
import {
  parseSolicitationFromObject,
  Solicitation,
} from "@/models/Solicitation";
import {
  parseSolicitationQuestionAnswersFromObject,
  SolicitationQuestionAnswers,
} from "@/models/SolicitationQuestionAnswers";
import {
  parseSolicitationQuestionSectionsFromArray,
  SolicitationQuestionSections,
} from "@/models/SolicitationQuestionSection";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const getSavedAnswers = async (solId: string) => {
  let res: SolicitationQuestionAnswers;
  res = await axios
    .post(
      `${
        apiEndpoints.solicitationQuestionsGetSavedAnswers
      }/${encodeURIComponent(solId)}/user-getting-answers`
    )
    .then((r) => {
      const d = extractAxiosData(r) || [];
      if (d.hasOwnProperty("no")) {
        throw CustomException("No record", "empty");
      }
      return parseSolicitationQuestionAnswersFromObject(d);
    });
  return res;
};

const saveQuestionAnswers = async (
  data: SolicitationQuestionSections,
  sol: Solicitation
) => {
  const payload = questionsApplicationPayload(data, sol);
  let res: any;
  res = await axios
    .post(
      `${apiEndpoints.solicitationQuestionsSaveAnswers}/${encodeURIComponent(
        sol.id
      )}/save-answers-draft`,
      payload
    )
    .then((r) => {
      const d = extractAxiosData(r) || [];
      return {
        id: d[0],
        success: d[1]["success"],
        data: d[1]["id"],
      };
    });
  return res;
};

const apply = async (data: SolicitationQuestionSections, sol: Solicitation) => {
  const payload = questionsApplicationPayload(data, sol);
  let res;
  res = await axios
    .post(
      `${apiEndpoints.solicitationQuestionsSubmitAnswers}/${encodeURIComponent(
        sol.id
      )}/save-answers-submit`,
      payload
    )
    .then((r) => {
      const d = extractAxiosData(r) || [];
      return {
        success: d[1].success || false,
        application: parseApplicationFromObject(d[1].id),
      };
    });
  return res;
};

const questionsApplicationPayload = (
  data: SolicitationQuestionSections,
  sol: Solicitation
) => {
  const authStore = useAuthStore();
  const otherInfo = {
    solicitationName: sol.name,
    solicitationId: sol.id,
    submitStatus: "draft",
    applicantFirstName: authStore.authUser?.firstName,
    applicantLastName: authStore.authUser?.lastName,
    applicantEmail: authStore.authUser?.email,
  };

  const d = JSON.stringify({
    sections: [...data],
    ...otherInfo,
  });

  let payload = new FormData();
  payload.append("inputs", d);
  return payload;
};

const getQuestions = async (solId: string) => {
  let res;
  try {
    const authStore = useAuthStore();
    const endpoint = authStore.isDonor
      ? apiEndpoints.solicitationQuestionsGet
      : apiEndpoints.solicitationQuestionsGetApplicant;
    res = await axios
      .get(`${endpoint}/${encodeURIComponent(solId)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (d["sections"]) {
          return parseSolicitationQuestionSectionsFromArray(d["sections"]);
        }
        throw new Error(`HTTP error! status: Sections missing`);
      });
  } catch (error) {
    throw error;
  }
  return res;
};

const questions = async (url: string) => {
  let res: ApplicationInfo;
  try {
    res = await axios
      .get(`${apiEndpoints.publicFiles}/${encodeURIComponent(url)}`)
      .then((r) => {
        const d = extractAxiosData(r) || [];
        if (d.hasOwnProperty("no"))
          throw CustomException(
            `HTTP error! status: Missing questions`,
            "none"
          );
        else if (d.hasOwnProperty("sections"))
          return parseApplicationInfoFromObject(d);
        else throw new Error(`HTTP error! status: Sections missing`);
      });
  } catch (error) {
    throw error;
  }
  return res;
};

const validateQuestionsPayload = (data: SolicitationQuestionSections) => {
  let inyxz = 0;
  for (const section of data) {
    let inyx = 0;
    inyxz++;
    for (const question of section.questions) {
      inyx++;
      if (question.markFull === null || question.markFull === undefined || question.markFull.toString() === "") {
        console.log(question,"data")
        throw new Error(
          `Missing markFull value for question number ${inyx} on section  ${inyxz}`
        );
        
      }
    }
    inyx = 0;
  }
  inyxz = 0;
};

/*const updateQuestions = async (data: any, solId: string) => {
  let res;
  try {
    const payload = questionsPayload(data);
    res = await axios
      .post(
        `${apiEndpoints.solicitationQuestionsUpdate}/${encodeURIComponent(
          solId
        )}`,
        payload
      )
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          solicitation: parseSolicitationFromObject(d[2].id[0]),
          sections: parseSolicitationQuestionSectionsFromArray(d[1].sections),
          status: d[2].success,
        };
      });
  } catch (error) {
    throw error;
  }
  return res;
};*/

const updateQuestions = async (data: any, solId: string) => {
  let res;
  try {
    // Validate the payload before sending to the API
    validateQuestionsPayload(data);

    const payload = questionsPayload(data);
    res = await axios
      .post(
        `${apiEndpoints.solicitationQuestionsUpdate}/${encodeURIComponent(
          solId
        )}`,
        payload
      )
      .then((r) => {
        const d = extractAxiosData(r) || [];
        return {
          solicitation: parseSolicitationFromObject(d[2].id[0]),
          sections: parseSolicitationQuestionSectionsFromArray(d[1].sections),
          status: d[2].success,
        };
      });
  } catch (error) {
    throw error;
  }
  return res;
};

const questionsPayload = (data: SolicitationQuestionSections) => {
  let sections = JSON.stringify({
    sections: [...data],
  });

  let payload = new FormData();
  payload.append("qJson", sections);
  return payload;
};

export {
  questions,
  getSavedAnswers,
  saveQuestionAnswers,
  updateQuestions,
  getQuestions,
  apply,
};

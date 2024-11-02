import { KeyValPair } from "@/types/KeyValPair";
import axios from "axios";
import { ref } from "vue";

let loading = ref(false);

const login = async (email: string, password: string) => {
  loading.value = true;
  let resp: KeyValPair = {};

  try {
    await axios.post('https://grantman-czivjdfhnq-ez.a.run.app/login-a-user', ).then((r) => {});
  } catch (error) {
    resp = {
      errors: (error as any).response.data.errors,
    };
    loading.value = false;
  }
  return resp;
};

import React from "react";
import GenericTemplate from "../templates/GenericTemplate";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { ExternalLink } from "../ExternalLink ";

// app.use(cors); /* NEW */ 

// app.use(express.json());

export default function HomePage(){

  const[probability,setProbability] = useState("");
  const [percentage, setPercentage] = useState("");
  // const[addText, setAddText] = useState("");

  const {control} = useForm({
    defaultValues: {
        checkBox: false,
        textBox: "",
        pullDown: "",
    },
})


  const get_end_point_url = "https://85ojszfq8k.execute-api.ap-northeast-1.amazonaws.com/default/GTM_GET_TRIGGER_RANDOM_PERCENT"
  const post_end_point_url = "https://t6jpok8m65.execute-api.ap-northeast-1.amazonaws.com/Stage/GTM-MANAGEMENT-SCREEN-PROBABILITIES"


  const GetPercentage = async () => {
    const response = await fetch(get_end_point_url)
      const res = await response.json();
      console.log(res);
      return res;
    }

//現在の確率を取得
  const GetButtonClick = async () => {
    const res = await GetPercentage();
    setPercentage(res.percent_value);
    console.log(res.percent_value);
  }

  // const ChangePercentage = async () => {
  //   const response = await fetch(post_end_point_url,{
  //     method: 'POST',
  //   });
  //   const res = await response.json();
  //   console.log(res);
  //   return res;
  // }

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

// POST メソッドの実装の例
  const postFetch = () => {

    fetch(post_end_point_url, {
        method: 'POST',
        body: JSON.stringify(data)
    }).then((response) => {
        if(!response.ok) {
            console.log('error!');
        } 
        console.log('ok!');
        return response.json();
    }).then((data)  => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    });
  };

  const handleChangeProbability = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

//確率を変更するAPIにPOSTする処理
  const handleClick = async () => {
    const res = await postFetch();
    console.log(res);
  }

  
  return (
    <GenericTemplate title="GTMポップアップの確率操作">
    <ExternalLink url="https://storage.googleapis.com/1007_arai_gtm_popup/gtm_popup_right_down.html" title="確率操作対象のサイト" />

  {/* <input
    value={text}
    onChange={(event)=>setText(event.target.value)}
  /> */}

  {/* <button onClick={onClickAddText}>変更</button> */}

  <Controller
    control={control}
    name="textBox"
    render={({ field }) => (
        <TextField
            {...field}
            label="確率"
            name={formData.name}
            onChange={handleChange} 
            value={formData.probability}
            fullWidth
            margin="normal"
            placeholder="確率を指定してください"
        />
    )}
  />
  <Button
    variant="contained"
    color="primary"
    type="submit"
    onClick={GetButtonClick}
  >
    現在の確率を取得
  </Button>
  <Button
    variant="contained"
    color="primary"
    type="submit"
    onClick={ChangeButtonClick}
  >
    変更
  </Button>

  {/* <p>確率の入力値は：{`${probability}% です`}</p> */}
  <p>現在の確率は：{`${percentage}% です`}</p>

  </GenericTemplate>
  );
};

// export const getServerSideProps = async() => {
//   const res = await GetPercentage();
//   console.log(res);
//   return {
//     props: {
//       initialPercentage: res.percent_value
//     }
//   };
// };

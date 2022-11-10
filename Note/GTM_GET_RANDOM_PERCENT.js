const axios = require('axios');

const api_key = process.env.GCP_API_KEY;
const api_base_url = `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${process.env.GTM_ACCOUNT_ID}/containers/${process.env.GTM_CONTAINER_ID}`;


// GTMの変数をAPIで書き換える
exports.handler = async (event, context, callback) => {
  
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const access_token = await getToken(REFRESH_TOKEN);

  const auth = `Bearer ${access_token}`;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
    'Authorization': auth
  }

  // GTMの最新のWorkspace IDを取得
  const workspace_id = await getWorkspaceId(headers);

  const trigger_id = process.env.GTM_TRIGGER_ID;
  
  // docによると?key=はいらなそう？
  const get_trigger_api_url = `${api_base_url}/workspaces/${workspace_id}/triggers/${trigger_id}`;

  let result, percent_value = 0;

  let response_message = 'success';
  let statusCode = 200;
  try {
    result = await axios.get(get_trigger_api_url, { 'headers': headers });
    const data = result.data;
    console.log(data['filter']);
    const target_filter = data.filter.filter(f => {
      return f.type === 'less';
    })
    const parameter = target_filter[0].parameter.filter(p => {  // なぜか配列が挟まってるので[0]。
      return p.key === 'arg1';
    })
    percent_value = Number(parameter[0].value);
    console.log(percent_value);
  } catch (e) {
    console.log(e);
    response_message = e;
    statusCode = 500
  }
  const response = {
    statusCode: statusCode,
    body: JSON.stringify({
      message: response_message,
      percent_value: percent_value
    })
  };
  return response;
};

const getWorkspaceId = async (headers) => {
  const api_get_workspaceid_url = `${api_base_url}/workspaces?key=${api_key}`;
  let result = await axios.get(api_get_workspaceid_url, { 'headers': headers });
  if (!result) {
    throw new Error("Not gained");
  }
  return result.data.workspace[0].workspaceId;
}

// refresh token から access token を作成
const getToken = async (refresh_token) => {
  let params = new URLSearchParams();
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_token);

  let result = await axios.post('https://oauth2.googleapis.com/token', params);
  return result.data.access_token;
}

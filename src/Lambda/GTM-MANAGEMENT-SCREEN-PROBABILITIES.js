const axios = require('axios');

const api_key = process.env.GCP_API_KEY;
const api_base_url = `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${process.env.GTM_ACCOUNT_ID}/containers/${process.env.GTM_CONTAINER_ID}`;

exports.handler = async (event, context, callback) => {
  // GTMの変数をAPIで書き換える
  
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
  // const update_trigger_api_url = `${api_base_url}/workspaces/${workspace_id}/triggers/${trigger_id}?key=${api_key}`;
  const update_trigger_api_url = `${api_base_url}/workspaces/${workspace_id}/triggers/${trigger_id}`;

  // const version_api_url = `${api_base_url}/workspaces/${workspace_id}:create_version?key=${api_key}`;
  const version_api_url = `${api_base_url}/workspaces/${workspace_id}:create_version`;


  // event引数から更新値を読み取る
  const request_body = JSON.parse(event.body)
  const new_value = String(request_body.new_value); // todo
  console.log("new value: " + new_value);

  let result;
  let body = {
    "name": "RANDOM TRIGGER",
    "type": "domReady",
    "filter": [
      {
                    "type": "contains",
                    "parameter": [
                        {
                            "type": "template",
                            "key": "arg0",
                            "value": "{{Page URL}}"
                        },
                        {
                            "type": "template",
                            "key": "arg1",
                            "value": "httpshttps://storage.googleapis.com/1007_arai_gtm_popup/variable-popup-probability/variable_popup.html"
                        }
                    ]
                },
                {
                    "type": "less",
                    "parameter": [
                        {
                            "type": "template",
                            "key": "arg0",
                            "value": "{{RANDOM}}"
                        },
                        {
                            "type": "template",
                            "key": "arg1",
                            "value": new_value
                        }
                    ]
                }
    ]
  };

  let response_message = 'success';
  try {
    // トリガーのアップデート
    await axios.put(update_trigger_api_url, body, { 'headers': headers });
    
    result = await axios.post(version_api_url, {"name": "latest!", "notes":"latest!"}, {'headers': {...headers, ...{'Authorization': auth }}});
    if (!result) {
      throw new Error("Not gained");
    }
    let version_id = result.data.containerVersion.containerVersionId;
    console.log('new version id: ' + version_id);
    if (!version_id) {
      throw new Error("id not found.");
    }
    const publish_api_url = `${api_base_url}/versions/${version_id}:publish?key=${api_key}`;
    await axios.post(publish_api_url, null, {'headers': {...headers, ...{'Authorization': auth }}});
  } catch (e) {
    console.log(e);
    response_message = e;
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      "message": response_message
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

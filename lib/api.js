const axios = require('axios');
const { getConfig } = require('./config');

function getApiBaseUrl() {
  const config = getConfig();
  return config.server || 'https://snipshare.dxstudio.site';
}

function getAuthHeaders() {
  const config = getConfig();
  const token = config.token;

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function uploadSnippet(snippetData) {
  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/snippets`,
      snippetData,
      {
        headers: getAuthHeaders(),
        timeout: 30000
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: '请求超时，请检查网络连接'
      };
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        return {
          success: false,
          error: '认证失败，请设置正确的 token'
        };
      }

      if (status === 409) {
        return {
          success: false,
          error: '片段已存在'
        };
      }

      return {
        success: false,
        error: `服务器错误：${status}`
      };
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: '连接服务器失败，请检查网络'
      };
    }

    return {
      success: false,
      error: error.message || '未知错误'
    };
  }
}

async function getRemoteSnippets() {
  try {
    const response = await axios.get(
      `${getApiBaseUrl()}/snippets`,
      {
        headers: getAuthHeaders(),
        timeout: 30000
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: '请求超时，请检查网络连接'
      };
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        return {
          success: false,
          error: '认证失败，请设置正确的 token'
        };
      }

      return {
        success: false,
        error: `服务器错误：${status}`
      };
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: '连接服务器失败，请检查网络'
      };
    }

    return {
      success: false,
      error: error.message || '未知错误'
    };
  }
}

async function deleteRemoteSnippet(id) {
  try {
    const response = await axios.delete(
      `${getApiBaseUrl()}/snippets/${id}`,
      {
        headers: getAuthHeaders(),
        timeout: 30000
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: '请求超时，请检查网络连接'
      };
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        return {
          success: false,
          error: '认证失败，请设置正确的 token'
        };
      }

      if (status === 404) {
        return {
          success: false,
          error: '片段不存在'
        };
      }

      return {
        success: false,
        error: `服务器错误：${status}`
      };
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: '连接服务器失败，请检查网络'
      };
    }

    return {
      success: false,
      error: error.message || '未知错误'
    };
  }
}

async function downloadSnippet(id) {
  try {
    const response = await axios.get(
      `${getApiBaseUrl()}/snippets/${id}`,
      {
        headers: getAuthHeaders(),
        timeout: 30000
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: '请求超时，请检查网络连接'
      };
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        return {
          success: false,
          error: '认证失败，请设置正确的 token'
        };
      }

      if (status === 404) {
        return {
          success: false,
          error: '片段不存在'
        };
      }

      return {
        success: false,
        error: `服务器错误：${status}`
      };
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: '连接服务器失败，请检查网络'
      };
    }

    return {
      success: false,
      error: error.message || '未知错误'
    };
  }
}

module.exports = { uploadSnippet, getRemoteSnippets, deleteRemoteSnippet, downloadSnippet };

import axios from 'axios';

export const FETCH_ARTICLES = 'fetch_articles';

export const fetchArticles = (source) => async (dispatch) => {
  let url;
  try {
    if (source) {
      url = `https://api.spacexdata.com/v3/launches?limit=100${source}`;
    } else {
      url = `https://api.spaceXdata.com/v3/launches?limit=100`;
    }
  } catch (error) {
    console.log(error);
  }

  const res = await axios.get(url);
  console.log('res', res.data);

  dispatch({
    type: FETCH_ARTICLES,
    payload: res.data,
  });
};

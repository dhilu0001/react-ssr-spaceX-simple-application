/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PropTypes from 'prop-types'; // ES6
import { fetchArticles } from '../actions';
import ArticleDetailModal from '../components/ArticleDetailModal';
import { Year, launchSuccess, landSuccess } from '../constants/filterConstants';

const HomePage = (props) => {
  const [modal, setModal] = useState(false);
  const [launch_year, setLaunchYear] = useState('');
  const [launchStatus, setLaunchStatus] = useState('');
  const [landStatus, setLandSuccess] = useState('');
  console.log('render articles:', props);

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    if (launch_year || launchStatus || landStatus) {
      const source = launch_year + launchStatus + landStatus;
      const { fetchArticles } = props;
      fetchArticles(source);
    }
  }, [launch_year, launchStatus, landStatus]);
  const handleFilter = (event, param) => {
    switch (event.target.id) {
      case 'launch_year':
        setLaunchYear('&launch_year=' + param);
        break;
      case 'launchSuccess':
        setLaunchStatus('&launch_success=' + param);
        break;
      case 'landSuccess':
        setLandSuccess('&land_sucess=' + param);
        break;
      default:
        return null;
    }
  };

  const renderYear = () => {
    return Year.map((year) => (
      <div className="col m6">
        <div>
          <a
            className="waves-effect waves-light btn"
            id="launch_year"
            href="javascript:void(0)"
            onClick={(event) => handleFilter(event, year)}
          >
            {year}
          </a>
        </div>
      </div>
    ));
  };

  const renderLaunchStatus = () => {
    return launchSuccess.map((status) => (
      <div className="col m6">
        <div>
          <a
            className="waves-effect waves-light btn"
            href="javascript:void(0)"
            id="launchSuccess"
            onClick={(event) => handleFilter(event, status)}
          >
            {status}
          </a>
        </div>
      </div>
    ));
  };

  const renderLandStatus = () => {
    return landSuccess.map((status) => (
      <div className="col m6">
        <div>
          <a
            className="waves-effect waves-light btn"
            href="javascript:void(0)"
            id="landSuccess"
            onClick={(event) => handleFilter(event, status)}
          >
            {status}
          </a>
        </div>
      </div>
    ));
  };

  const renderArticles = () => {
    return props.articles.map((article) => (
      <div className="col s12 m6 l3" key={article.title}>
        <div className="card medium">
          <div className="card-image">
            <LazyLoadImage alt={article.title} src={article.links.mission_patch} />
          </div>
          <div className="card-content">
            <span className="card-title">{article.mission_name}</span>
            <p>Mission ID's: {article.mission_id}</p>
            <p>Launch Year:{article.launch_year}</p>
            <p>Successful Launch:{article.launch_success ? 'True' : 'False'}</p>
            <p>
              Successful Landing:{article.rocket.first_stage.cores.land_success ? 'True' : 'False'}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  const head = () => {
    return (
      <Helmet key={Math.random()}>
        <title>spaceX Launch Program</title>
        <meta property="og:title" content="spaceX Launch Program" />
        <meta
          name="description"
          content="space X Launch programs on last few years and their status"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://react-ssr-ilker.herokuapp.com" />
      </Helmet>
    );
  };

  const { fetchArticles: loadArticles } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadArticles();
  }, [loadArticles]);
  return (
    <div>
      {head()}
      {modal ? <ArticleDetailModal handler={closeModal} data={currentArticle} /> : null}
      <div className="row">
        <div className="section">
          <div className="row">
            <div class="col s3">
              <h5>Filter</h5>
              <div className="row">
                <p>Launch Year</p>
                {renderYear()}
              </div>
              <div className="row">
                <p>Successful Launch</p>
                {renderLaunchStatus()}
              </div>
              <div className="row">
                <p>Successful Landing</p>
                {renderLandStatus()}
              </div>
            </div>
            <div class="col s9">{renderArticles()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    articles: state.articles,
  };
};

const loadData = (store) => {
  // For the connect tag we need Provider component but on the server at this moment app is not rendered yet
  // So we need to use store itself to load data
  return store.dispatch(fetchArticles()); // Manually dispatch a network request
};

HomePage.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.any),
  fetchArticles: PropTypes.func,
};

HomePage.defaultProps = {
  articles: [],
  fetchArticles: null,
};

export default {
  component: connect(mapStateToProps, { fetchArticles })(HomePage),
  loadData,
};

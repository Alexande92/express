import React, {Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = (
  {
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile, loading }
  }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return (
    loading && profile === null ? <Spinner/>
    : <Fragment>
      <h1 className="large text-primary">
        Dashboard
      </h1>
      <p className="lead">
        <i className="fas fa-user"/> Welcome { user && user.name}
      </p>
      {
        profile !== null ?
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience}/>
          <Education education={profile.education}/>
          
          <button className="btn btn-danger my-2"
            onClick={() => deleteAccount}>
            <i className="fas fa-user-minus"/>
            Delete Account
          </button>
        </Fragment> :
        <Fragment>
          <p className="mb-1">
            You haven't setup a profile, please add some more info
          </p>
          <Link to='create-profile' className="btn btn-primary ml-1">
            Create profile
          </Link>
        </Fragment>
      }
      </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
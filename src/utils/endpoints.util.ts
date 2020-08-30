const { REACT_APP_BASEURL } = process.env;

export const LOGIN_API = `${REACT_APP_BASEURL}auth/local`;
export const SIGNUP_API = `${REACT_APP_BASEURL}auth/local/register`;
export const ORGANISATION_TYPES_API = `${REACT_APP_BASEURL}organisation-registration-types`;

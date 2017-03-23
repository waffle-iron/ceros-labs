import jsonp from '../util/jsonp';
import ModelSanitizer from '../util/ModelSanitizer';
import Promise from 'promise';

const JOB_BOARD_URL = "https://api.greenhouse.io/v1/boards/ceros/jobs/";

/**
 * Function to get all Job Listings
 *
 * @return {Promise}
 */
const getJobListings = function() {
    return new Promise(function (resolve, reject) {

        jsonp(JOB_BOARD_URL, function (error, data) {

            if (error) {
                return reject(error);
            }

            resolve(
                ModelSanitizer.sanitizeJobListing(data)
            );
        });
    });
};

/**
 * Function to get individual job
 *
 * @param {int} jobId
 * @return {Promise}
 */
const getJob = function(jobId) {

    return new Promise(function (resolve, reject) {

        try {
            jsonp(JOB_BOARD_URL + encodeURIComponent(jobId), function (error, data) {
                if (error) {
                    reject(error);

                    return;
                }

                resolve(
                    ModelSanitizer.sanitizeJob(data)
                );
            });
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    getJobListings,
    getJob
}
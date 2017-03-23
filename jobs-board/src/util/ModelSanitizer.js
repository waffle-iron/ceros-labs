import _ from 'lodash';
import he from 'he';

const JOB_LISTING_FIELDS = ['id', 'absolute_url', 'location_name', 'title', 'badge_one', 'badge_two'];
const JOB_FIELDS = _.concat(JOB_LISTING_FIELDS, ['content']);

/**
 * Turn location.name into location_name on job object
 *
 * @param {Object} job
 * @return {Object}
 */
const flattenLocation = function (job) {

    let locationName = null;

    if (job.location && job.location.name) {
        locationName = job.location.name;
    }

    job.location_name = locationName;

    return job;
};

/**
 * Remove html entity encoding from job's content
 *
 * @param {Object} job
 * @return {Object}
 */
const unEscapeContent = function (job) {

    let content = job.content || "";

    content = he.decode(content, {
        'allowUnsafeSymbols': true
    });

    content = he.decode(content, {
        'allowUnsafeSymbols': true
    });


    job.content = content;

    return job;
};

/**
 * Find badge meta fields and convert them to properties on an object
 *
 * @param {Object} job
 * @return {Object}
 */
const resolveBadgeFields = function (job) {

    return _.chain(job.metadata || [])
        .filter(function (metaField) {
            return (metaField.name && metaField.name.startsWith("Badge"));
        })
        .map(function (badgeField) {

            return [
                _.snakeCase(badgeField.name),
                badgeField.value || null
            ];

        })
        .fromPairs()
        .value();
};

export default {

    /**
     * Flatten and remove unnecessary elements from job listings
     *
     * @param {Object} listings
     * @return {Object}
     */
    sanitizeJobListing(listings) {

        return _.map(listings.jobs || [], function (job) {

                flattenLocation(job);

                let plainFields = _.pick(job, JOB_LISTING_FIELDS);
                let badgeFields = resolveBadgeFields(job);

                return _.merge(plainFields, badgeFields);
            });

    },

    /**
     * Flatten and remove unnecessary elements from job
     *
     * @param {Object} job
     * @return {Object}
     */
    sanitizeJob(job) {

        flattenLocation(job);
        unEscapeContent(job);

        let plainFields = _.pick(job, JOB_FIELDS);
        let badgeFields = resolveBadgeFields(job);

        return _.merge(plainFields, badgeFields);
    }
}
import { upperFirst, camelCase } from 'lodash';

const timelineFetcherServiceFactory = ($ngRedux, apiService, $interval) => {
  let fetcher;

  const update = ({statuses, timeline, showImmediately}) => {
    const ccTimeline = camelCase(timeline);

    const action = {
      type: 'ADD_NEW_STATUSES',
      data: {
        statuses,
        timeline: ccTimeline,
        showImmediately
      }
    };

    $ngRedux.dispatch(action);
    $ngRedux.dispatch({type: 'UPDATE_TIMESTAMPS'});
  };

  const fetchAndUpdate = ({timeline = 'friends', older = false, showImmediately = false}) => {
    const args = { timeline };
    const timelineData = $ngRedux.getState().statuses.timelines[camelCase(timeline)];

    if(older) {
      args['until'] = timelineData.minVisibleId;
    } else {
      args['since'] = timelineData.maxId;
    }

    apiService.fetchTimeline(args).
      then((statuses) => update({statuses, timeline, showImmediately}));
  };

  const startFetching = ({timeline = 'friends'}) => {
    fetchAndUpdate({timeline, showImmediately: true});

    const boundFetchAndUpdate = () => fetchAndUpdate({timeline});
    fetcher = $interval(boundFetchAndUpdate, 10000);
  };

  const timelineFetcherService = {
    startFetching,
    fetchAndUpdate
  };

  return timelineFetcherService;
};

timelineFetcherServiceFactory.$inject = ['$ngRedux', 'apiService', '$interval'];

export default timelineFetcherServiceFactory;

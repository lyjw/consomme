import {List} from 'immutable';

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];

  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);
  if (aVotes > bVotes)        return [a];
  else if (aVotes < bVotes)   return [b];
  else                           return [a, b];
}

export function next(state) {
  // .concat the winners of the first vote back into the list of
  // entries that can be paired for a vote
  const entries = state.get('entries')
                          .concat(getWinners(state.get('vote')));

  // Merge an update into the old state
  // Here, the first two entries are set up as the vote pair
  // and the rest of the entries in the new version of entries
  return state.merge({
    vote: Map({ pair: entries.take(2) }),
    entries: entries.skip(2);
  });
}

export function vote(state, entry) {
  return state.updateIn(
    ['vote', 'tally', entry],
    0,
    tally => tally + 1
  );
}

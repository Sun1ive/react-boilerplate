import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { withRouter, Link } from 'react-router';
import { translate } from 'react-i18next';
import { fetchActor, deleteActor } from '@/redux/data/actors';
import { getActor } from '@/redux';

import Poster from '@/components/Poster';
import Button from '@/components/Button';

import withStyles from 'withStyles';
import styles from './styles.scss';

const ActorsDetailsPage = ({
  actor = {},
  t,
  onEditActorHandler,
  onDeleteActorHandler,
}) => (
  <div className={styles.root}>
    <div className={styles.poster}>
      <Poster
        isFavorite
        src={actor.photo}
        title={actor.name}
      />
    </div>
    <div className={styles.content}>
      <div className={styles.title}>{actor.name}</div>
      <div className={styles.info}>
        <p>{actor.year}</p>
        <p>{actor.description}</p>
        <p>{actor.director}</p>
        <h1 className={styles.actorsList}>{t('Actor movies list')}</h1>
        <ul>
          {actor.movies.map((movie, idx) => <li key={idx}>{movie}</li>)}
        </ul>
        <p>
          <Link to="/actors">{t('Back to the list of actors')}</Link>
        </p>
        <br />
        <Button color="green" onClick={onEditActorHandler}>
          {t('Edit actor')}
        </Button>
        <Button color="red" onClick={onDeleteActorHandler}>
          {t('Delete actor')}
        </Button>
      </div>
    </div>
  </div>
);

export default compose(
  withStyles(styles),
  withRouter,
  translate(),
  provideHooks({
    fetch: ({ dispatch, params, setProps }) =>
      dispatch(fetchActor(params.id)).then((response) => {
        console.log(response);
        setProps({
          actorId: response.payload.result,
        });
      }),
  }),
  connect(
    (state, ownProps) => ({
      actor: getActor(state, ownProps.actorId),
    }),
    {
      deleteMovieAction: deleteActor,
    },
  ),
  withHandlers({
    onEditActorHandler: ({ router, actorId }) => () => {
      router.push(`/actors/${actorId}/edit`);
    },
    onDeleteActorHandler: ({
      deleteActorAction,
      router,
      params,
    }) => async () => {
      await deleteActorAction(params.id);
      router.push('/actors');
    },
  }),
)(ActorsDetailsPage);

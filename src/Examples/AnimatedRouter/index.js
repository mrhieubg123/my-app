import React from 'react';
import {Router, Route, useLocation} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group'


const AnimatedRouter = ({ children}) => {
    const lacation = useLocation();

  return (
    <TransitionGroup component={null}>
        <CSSTransition 
            key={lacation.pathname}
            timeout={300}
            classNames="page"
            unmountOnExit
        >
            {children}
        </CSSTransition>
    </TransitionGroup>
  );
};

export default AnimatedRouter;

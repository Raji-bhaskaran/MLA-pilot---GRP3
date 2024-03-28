import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import BikeIcon from '@material-ui/icons/DirectionsBike';
import PoolIcon from '@material-ui/icons/Pool';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import OtherIcon from '@material-ui/icons/HelpOutline';

const ExercisesIcon = ({ icon }) => {

    const getIcon = (icon) => {
        switch (icon) {
            case 'Gym':
                return <FitnessCenterIcon fontSize="large" />
            case 'Swimming':
                return <PoolIcon fontSize="large" />
            case 'Running':
                return <DirectionsRunIcon fontSize="large" />
            case 'Cycling':
                return <BikeIcon fontSize="large" />
            case 'Other':
                return <OtherIcon fontSize="large" />
            default:
                return <OtherIcon fontSize="large" />
        }
    };

    return (
        getIcon(icon)
    );
};

export default ExercisesIcon;
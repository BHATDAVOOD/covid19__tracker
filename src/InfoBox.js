import React from 'react';
import {Card,CardContent,Typography} from '@material-ui/core';
import "./InfoBox.css";

function InfoBox({title,cases,active,isRed,total,...props}) {
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
        <CardContent>
        {/* Title i.e; Coronavirus Cases */}
        <Typography className="infoBox__title" color="textSecondary">{title}</Typography>   

        {/* New Additions */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

        {/* Total */}
        <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>   
        </CardContent>
        </Card>
    )
}

export default InfoBox

import React from 'react'
import { Bar } from 'react-chartjs'

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 150
    },
    'Normal': {
        min: 151,
        max: 500
    },
    'Expensive': {
        min: 501,
        max: 100000
    }
}
const BookingsChart = props => {
    const chartData = { labels: [], datasets: [] };
    let values = [];
    for (let bucket in BOOKINGS_BUCKETS) {
        const filteredBookings = props.bookings.reduce((preValue, currentValue) => {
            if (currentValue.event.price > BOOKINGS_BUCKETS[bucket].min
                && currentValue.event.price < BOOKINGS_BUCKETS[bucket].max)
                return preValue + 1
            else
                return preValue
        }, 0)
        values.push(filteredBookings)
        chartData.labels.push(bucket);
        chartData.datasets.push({
            //label: "DATASET",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        })
        values = [...values]
        values[values.length - 1] = 0
        values = [0]
    }

    return (
        <div style={{ textAlign: "center" }}>
            <Bar data={chartData} />
        </div>
    )
}

export default BookingsChart

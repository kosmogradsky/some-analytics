import * as React from 'react';
import * as s from './App.css'
import { Link } from '..';
import { LineChart, ViewsEachMonthEntry } from '../LineChart/LineChart';

const viewsEachMonthEntries: ViewsEachMonthEntry[] = Array(10).fill(undefined).map((_, index) => ({
  month: new Date(2019, index),
  views: Math.floor(Math.random() * 10000)
}))

interface Props {
  state: number;
}

export const App: React.FunctionComponent<Props> = ({ state }) => {
  return (
    <div className={s.root}>
      <header>
        <h1 className='title is-1'>Some Analytics</h1>
        <div className='subtitle is-4'>Doing some analytics since some time ago!</div>
      </header>
      <nav>
        <Link to='/allItems'>AllItems</Link>
        <Link to='/item/1'>Item1</Link>
      </nav>
      <div>{state}</div>
      <LineChart
        entries={viewsEachMonthEntries}
        height={400}
        width={600}
      />
    </div>
  )
}
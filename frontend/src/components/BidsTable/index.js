import React, { Component, Fragment } from 'react';
import { Table } from 'semantic-ui-react';

export default class BidsTable extends Component {

    render() {
        var emptySellSideCells = [];
        for(let i = this.props.sellSide.length; i < 5; i++) {emptySellSideCells.push(i);}
        var emptyBuySideCells = [];
        for(let i = this.props.buySide.length; i < 5; i++) {emptyBuySideCells.push(i);}
        
        return (
                <Fragment>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="2">Ask</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {emptySellSideCells.map(function(x){
                            return <Table.Row key={x}>
                                        <Table.Cell>-</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                      </Table.Row>;
                        })}
                        {this.props.sellSide.map(function(bid){
                            return <Table.Row key={bid.pkey}>
                                        <Table.Cell>{bid.price}</Table.Cell>
                                        <Table.Cell>{bid.amount}</Table.Cell>
                                      </Table.Row>;
                        })}
                        </Table.Body>
                    </Table>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="2">Buy</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {this.props.buySide.map(function(bid){
                            return <Table.Row key={bid.pkey}>
                                        <Table.Cell>{bid.price}</Table.Cell>
                                        <Table.Cell>{bid.amount}</Table.Cell>
                                      </Table.Row>;
                        })}
                        {emptyBuySideCells.map(function(x){
                            return <Table.Row key={x}>
                                        <Table.Cell>-</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                      </Table.Row>;
                        })}
                        </Table.Body>
                    </Table>
                </Fragment>
                );
    }
}
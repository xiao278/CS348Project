import React, { PureComponent, useEffect, useRef, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForceGraph2D } from 'react-force-graph';
import { forceManyBody, forceCenter, forceX, forceY} from 'd3';
import "./Statistics.css";

interface StatisticsProps {

}

interface LibStatsData {
    genre_books: {
        genre: string;
        book_count: number;
    }[];
    genre_books_stats: {
        count: number;
        avg: number
    }
    copy_status: {
        status: string;
        status_count: number;
    }[];
    genre_similarity: {
        genre_id1: number;
        genre1: string;
        genre_id2: number;
        genre2: string;
        shared_books: number;

    }[];
}

function DynamicTable({data}) {
    return (
        <div>
            <table border={1} style={{borderCollapse: "collapse"}}>
                <thead>
                    <tr>
                        {Object.entries(data[0]).map((item) => 
                            <th>{item[0]}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => 
                        <tr>
                            {Object.entries(row).map((item) => 
                                <td>{`${item[1]}`}</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

interface GraphNode {
    id: string;
    name: string;
    val?: number;
}

interface GraphLink {
    source: string;
    target: string;
    weight?: number;
}

function Statistics(props: StatisticsProps) {
    const [ libStats, setLibStats ] = useState<LibStatsData>();
    const [ nodes, setNodes ] = useState<GraphNode[]>();
    const [ links, setLinks ] = useState<GraphLink[]>();
    const [ maxLinkWeight, setMaxLinkWeight ] = useState<number>();

    function parseNodes() {
        const node_set = {}
        const temp_nodes:GraphNode[] = []
        libStats?.genre_similarity.map((link) => {
            const id1 = link.genre_id1.toString()
            const name1 = link.genre1

            if (node_set[id1] === undefined) {
                node_set[id1] = 1
                temp_nodes.push({
                    id: id1,
                    name: name1
                })
            }

            const id2 = link.genre_id2.toString()
            const name2 = link.genre2
            if (node_set[id2] === undefined) {
                node_set[id2] = 1
                temp_nodes.push({
                    id: id2,
                    name: name2
                })
            }
        })
        setNodes(temp_nodes)
    }

    function parseLinks() {
        const temp_links:GraphLink[] = []
        let temp_max_weight = 0;
        libStats?.genre_similarity.map((pair) => {
            const threshold = 100
            if (pair.shared_books > threshold) {
                temp_links.push({
                    source: pair.genre_id1.toString(),
                    target: pair.genre_id2.toString(),
                    weight: pair.shared_books
                })
                temp_max_weight = (pair.shared_books > temp_max_weight ? pair.shared_books : temp_max_weight)
            }
        })
        setMaxLinkWeight(temp_max_weight)
        setLinks(temp_links)
    }
 
    async function fetchStats() {
        let response = await fetch("http://localhost:8080/fetchStats", {
            method: 'GET'
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        });
        setLibStats(response)
        
    }

    useEffect(() => {
        if (libStats === undefined) {
            fetchStats();
            console.log("fetched stats");
        }
    },[])

    useEffect(() => {
        if (nodes === undefined && libStats !== undefined){
            parseNodes();
            console.log("parsed nodes");
            parseLinks();
            console.log("parsed links")
        }
    },[libStats])

    function sumCopies() {
        let counter = 0;
        libStats?.copy_status.map(item => {
            counter += item.status_count;
        })
        return counter
    }

    function GraphGenreBooks() {
        return (
            <div style={{width: "100%", height: "700px"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={libStats?.genre_books} layout='vertical' margin={{left: 50, right: 50}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis dataKey="genre" type="category" tick={{fill: "white"}}/>
                        <XAxis type="number" tick={{fill: "white"}}/>
                        <Tooltip contentStyle={{color: "#25283D"}} />
                        <Legend />
                        <Bar dataKey="book_count" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    function GraphSimilarity(props: {interact: boolean}) {
        const fgRef = useRef<any>();
        const [ fullscreen, setFullScreen ] = useState<boolean>(false);
        const windowSize = 500
        const fullSize = 800

        function setZoom(zoom:number, speed:number = 0) {
            const fg = fgRef.current
            if (fg === undefined) return;
            fg.centerAt(0, 0, speed)
            fg.zoom(zoom, speed)
        }

        useEffect(() => {
            const fg = fgRef.current
            if (fg === undefined) {
                console.log("fail to initialize forcegraph")
                return
            }
            fg.d3Force('link')?.distance((link:GraphLink) => {
                const baseWeight = (link.weight === undefined || maxLinkWeight === undefined) ? 0 : link.weight / maxLinkWeight
                if (baseWeight < 0.5) return 400;
                return (baseWeight ** 2 * -200) + 200;
            });
            fg.d3Force("charge", forceManyBody().strength(-200));
            fg.d3Force("x", forceX())
            fg.d3Force("y", forceY())
            setZoom(fullscreen ? 1 : 0.5)
            console.log("forcegraph initialized")
        },[])
        
        return (
            <div style={{height: windowSize, width: windowSize}}>
                <div className={fullscreen ? 'GraphDisplayFull' : 'GraphDisplay'} onClick={() => {
                    if (!fullscreen) {
                        setFullScreen(true)
                        setZoom(0.9, 1000)
                    }
                }}>
                    {nodes === undefined || links === undefined ? "N/A" : 
                        <ForceGraph2D 
                            ref={fgRef}
                            width={fullscreen ? fullSize: windowSize}
                            height={fullscreen ? fullSize: windowSize}
                            
                            graphData={{nodes: nodes, links: links}} 
                            enableZoomInteraction={props.interact || fullscreen} 
                            enablePanInteraction={props.interact || fullscreen} 
                            enableNodeDrag={props.interact || fullscreen}
                            // nodeAutoColorBy={"name"}
                            linkColor={(link) => {
                                const alpha = ((link.weight === undefined || maxLinkWeight === undefined) ? 0 : link.weight / maxLinkWeight) ** 1.5
                                return `rgba(249, 255, 166,${alpha})`
                            }}  
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                if (node.x === undefined || node.y === undefined) return;
                                const label = node.name;
                                const fontSize = 12/globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                    
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                                // @ts-ignore
                                ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                    
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = 'rgba(255,255,255,1)';
                                ctx.fillText(label, node.x, node.y);
                    
                                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                            }}
                        />
                    }
                    {fullscreen ? 
                        <button className='Common-Button' style={{position: "fixed", left: "30px", top: "30px", fontSize: "20px"}} onClick={() => {setFullScreen(false); setZoom(0.5, 1000)}}>Close</button>
                        : <></>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="StatPageContainer">
            <div>
                <h1>Status of copies (total {libStats === undefined ? "N/A" : `${sumCopies()}`})</h1>
                {libStats === undefined ? "N/A" : <DynamicTable data={libStats.copy_status} />}
            </div>
            <div>
                <h1>Top Genres</h1>
                {libStats === undefined ? "N/A" : <GraphGenreBooks />}
            </div>
            <div>
                <h1>Genre Similarity (top 100)</h1>
                <div>
                    <GraphSimilarity interact={false}/>
                </div>
            </div>
        </div>
    )
}

export { LibStatsData }
export default Statistics
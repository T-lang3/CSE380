import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    protected minMap(map: Map<number, [number, number, number]>){
        let min = Number.MAX_VALUE;
        let minkey = null;
        map.forEach((value, key) => {
            if (value[0] < min){
                min = value[0];
                minkey = key;
            }
        });
        return minkey;
    }

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        // Get the closest nodes in the graph to our to and from positions
        let start = this.mesh.graph.snap(from);
		let end = this.mesh.graph.snap(to);
		let pathStack = new Stack<Vec2>(this.mesh.graph.numVertices);
        let endpos = this.mesh.graph.positions[end];
		
		// Push the final position
		pathStack.push(to.clone());

        let openlist = new Map<number, [number, number, number]>();//Node and its f(g,h), g and its parent
        let closedlist = new Map<number, [number, number, number]>();
        
        openlist.set(start, [0, 0, start]);
        //console.log(openlist);
        let current = start;
        // current = this.minMap(openlist);
        // //console.log(current);
        while (openlist.size != 0){
        //for (let i = 0; i < 4; i++){
            current = this.minMap(openlist);
            let value = openlist.get(current);
            openlist.delete(current);
            closedlist.set(current, value);//move from open to closed

            if (current === end) { // End node found, exit loop
                //console.log("found end");
                break;
            }

            let neighbors = this.mesh.graph.getEdges(current);
            while (neighbors){
                let neighbor = neighbors.y;
                if (!closedlist.has(neighbor)){//not in closed list
                    let pos = this.mesh.graph.positions[neighbor];//x,y position
                    let g = value[1] + neighbors.weight;
                    //let h = Math.abs(pos.x - endpos.x) + Math.abs(pos.y - endpos.y);
                    let h = pos.distanceTo(endpos);
                    //console.log(current, value, openlist, closedlist, g, h, neighbors.weight);
                    if (!openlist.has(neighbor)){// if not on open list
                        openlist.set(neighbor, [g + h, g, current]);
                    }
                    else if (g + h < openlist.get(neighbor)[0]) {//on open list, but is better path
                        // Update neighbor's cost and parent
                        openlist.set(neighbor, [g + h, g, current]);
                    }
                }
                neighbors = neighbors.next;
            }
        }
        //console.log(closedlist.size);
        
		// pathStack.push(new Vec2(20,20));
        // //console.log(this.mesh.graph.getEdges(start));
        while (end != start){
            // //console.log(end);
            pathStack.push(this.mesh.graph.positions[end]);
            if (closedlist.get(end) == null){
                break;
            }
            end = closedlist.get(end)[2];//parent node
        }        
        //console.log(this.mesh.graph.getEdges(start));
        
        // console.log(closedlist);

		pathStack.push(this.mesh.graph.positions[start]);
        // console.log(pathStack);
		return new NavigationPath(pathStack);
    }
    
}
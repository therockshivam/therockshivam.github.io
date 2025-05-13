function dijkstra(graph, start, end) {
    let distances = {};
    let prev = {};
    let pq = new Set(Object.keys(graph));

    for (let node of pq) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    while (pq.size > 0) {
        let minNode = Array.from(pq).reduce((a, b) => (distances[a] < distances[b] ? a : b));
        pq.delete(minNode);

        if (minNode === end) break;

        for (let neighbor in graph[minNode]) {
            let newDist = distances[minNode] + graph[minNode][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                prev[neighbor] = minNode;
            }
        }
    }

    let path = [];
    for (let at = end; at; at = prev[at]) {
        path.push(at);
    }
    path.reverse();

    return { path, distance: distances[end] };
}

function findShortestPath() {
    let source = document.getElementById("source").value.toUpperCase();
    let destination = document.getElementById("destination").value.toUpperCase();

    if (!(source in graph) || !(destination in graph)) {
        document.getElementById("output").innerText = "Invalid locations!";
        return;
    }

    let result = dijkstra(graph, source, destination);
    if (result.distance === Infinity) {
        document.getElementById("output").innerText = "No route found!";
    } else {
        document.getElementById("output").innerText = `Route: ${result.path.join(" → ")}\nDistance: ${result.distance}`;
    }
}

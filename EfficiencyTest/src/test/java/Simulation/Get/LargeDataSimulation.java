package Simulation.Get;

import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

import static io.gatling.javaapi.core.CoreDsl.atOnceUsers;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.http;

public class LargeDataSimulation extends Simulation {
    public static final String HOSTNAME = "http://localhost:8080";

    private HttpProtocolBuilder httpProtocol = http
            .baseUrl(HOSTNAME + "/api/databaseinfo")
            .acceptHeader("application/json");

    private ScenarioBuilder scenarioBuilder =
            scenario("Back-end test")
                    .exec(http("Get tables and columns for sample user")
                            .get("/getfoldermap/user1"));

    {
        setUp(
                scenarioBuilder.injectOpen(atOnceUsers(1))
        ).protocols(httpProtocol);
    }
}

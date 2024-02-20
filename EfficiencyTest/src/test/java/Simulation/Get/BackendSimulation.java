package Simulation.Get;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

public class BackendSimulation extends Simulation {

    public static final String HOSTNAME = "http://localhost:8080";

    private HttpProtocolBuilder httpProtocol = http
            .baseUrl(HOSTNAME + "/api/userinfo")
            .acceptHeader("application/json");

    private ScenarioBuilder scenarioBuilder =
            scenario("Back-end test")
                    .exec(http("Get all users")
                            .get("/getall"));

    {
        setUp(
                scenarioBuilder.injectOpen(atOnceUsers(1))
        ).protocols(httpProtocol);
    }
}

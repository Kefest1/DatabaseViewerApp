package Simulation.Get;

import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;
import io.gatling.http.Predef.*;

import static io.gatling.javaapi.core.CoreDsl.atOnceUsers;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.http;


public class LoginSimulation extends Simulation {
    public static final String HOSTNAME = "http://localhost:8080";

    private HttpProtocolBuilder httpProtocol = http
            .baseUrl(HOSTNAME + "/api/userinfo")
            .acceptHeader("application/json");

    private ScenarioBuilder scenarioBuilder =
            scenario("Log-in simulation (assuming successfull)")
                    .exec(http("Get user")
                            .get("/getByUsername")
                            .queryParam("userName", "user1"));

    {
        setUp(
                scenarioBuilder.injectOpen(atOnceUsers(1))
        ).protocols(httpProtocol);
    }
}

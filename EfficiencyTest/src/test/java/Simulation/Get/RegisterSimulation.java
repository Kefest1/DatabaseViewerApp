package Simulation.Get;

import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.CoreDsl;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;
import lombok.val;

import static io.gatling.core.Predef.StringBody;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;
import scala.concurrent.duration.*;

public class RegisterSimulation extends Simulation {
    public static final String HOSTNAME = "http://localhost:8080";

    private HttpProtocolBuilder httpProtocol = http
            .baseUrl(HOSTNAME + "/api/userinfo")
            .acceptHeader("application/json")
            .contentTypeHeader("application/json");

    private static final String USER_PAYLOAD = "{\"username\": \"user5\"," +
            " \"email\": \"john.doe@example.com\"," +
            " \"password_hash\": \"ExamplePasswordForUser5\"}";

    private ScenarioBuilder scenarioBuilder =
            scenario("Log-in simulation (assuming successfull)")
                    .exec(http("Add user")
                            .post("/add")
                            .body(CoreDsl.StringBody(USER_PAYLOAD)).asJson()
                            .check(status().is(200)));

    {
        setUp(
                scenarioBuilder.injectOpen(atOnceUsers(1))
        ).protocols(httpProtocol);
    }
}

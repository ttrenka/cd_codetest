<?php
    //  define our functions
    function create_hobby_map($obj){
        $map = []; 
        foreach($obj->hobbies as $k => $v){
            for($i = 0; $i < count($v); $i++){
                $map[$v[$i]] = $k;
            }
        }
        return $map;
    }

    //  First interest wins; if we want the last, change [0] to [count($v->interests) - 1]
    function assign_hobby($obj, $map){
        foreach($obj->people as $k => $v){
            $v->hobby = $map[$v->interests[0]];
        }
    }

    //  variable definitions
    $url = "https://api.crystal-d.com/codetest";

    // Fetch the JSON file from crystald and convert to a PHP object.
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = json_decode(curl_exec($ch));
    curl_close($ch);     

    //  Clone the decoded JSON so that we can write to the object
    $parsed = clone $output;

    //  create the reverse map
    $map = create_hobby_map($parsed);

    //  do the hobby assignment
    assign_hobby($parsed, $map);
    //  ok, start our HTML
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Crystal D Code Test - Tom Trenka</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100;200;300;400;500;600;700;800&family=Lexend:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <script type="text/javascript">
            let data = <?php echo str_replace("'", "\'", json_encode($parsed->people, JSON_PRETTY_PRINT)); ?>;
        </script>
    </head>
    <body>
        <header>
            <h1>Imagine all the people...</h1>
        </header>
        <article>
            <table id="the-people">
                <thead>
                    <tr>
                        <th data-field="name" class="field-name">Name</th>
                        <th data-field="height" class="field-height">Height</th>
                        <th data-field="dob" class="field-dob">Date of Birth</th>
                        <th data-field="interests" class="field-interests">Interests</th>
                        <th data-field="hobby" class="field-hobby">Hobby</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </article>
        <!-- footer>
            <h3>For Debug Purposes only</h3>
<?php
        //  debug
            echo "<pre>";
            $out = json_encode($parsed /*->people */, JSON_PRETTY_PRINT);
            echo $out;
            echo '</pre>';
?>
        </footer -->
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>

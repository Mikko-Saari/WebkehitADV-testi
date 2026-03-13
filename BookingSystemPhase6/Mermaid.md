# CREATE


    participant User
    participant Frontend (form.js)
    participant Backend (Express API)
    participant Service
    participant PostgreSQL

    User->>Frontend (form.js): Submit resource form
    Frontend (form.js)->>Backend (Express API): POST /api/resources

    Note right of Frontend (form.js): Payload:\nresourceName\nresourceDescription\nresourcePrice\nresourcePriceUnit\nresourceAvailable

    Backend (Express API)->>Service: createResource(data)
    Service->>PostgreSQL: INSERT INTO resources

    alt Success
        PostgreSQL-->>Service: New resource row
        Service-->>Backend (Express API): Return created resource
        Backend (Express API)-->>Frontend (form.js): 201 Created + JSON
        Frontend (form.js)-->>User: Show new resource in list
    else Validation error
        Backend (Express API)-->>Frontend (form.js): 400 Bad Request
        Frontend (form.js)-->>User: Display error message
    end


# READ



    participant User
    participant Frontend (resources.js)
    participant Backend (Express API)
    participant Service
    participant PostgreSQL

    User->>Frontend (resources.js): Open Resource Page / Refresh
    Frontend (resources.js)->>Backend (Express API): GET /api/resources

    Backend (Express API)->>Service: getAllResources()
    Service->>PostgreSQL: SELECT * FROM resources

    alt Success
        PostgreSQL-->>Service: Array of resource rows
        Service-->>Backend (Express API): List of resources
        Backend (Express API)-->>Frontend (resources.js): 200 OK + JSON (ok: true, data: [...])
        
        Note right of Frontend (resources.js): Data fields:<br/>id, name, description,<br/>available, price, price_unit
        
        Frontend (resources.js)-->>User: Render "Resource list" (showing "Mikko")
    else Server Error
        PostgreSQL-->>Service: Database connection error
        Service-->>Backend (Express API): Throw Error
        Backend (Express API)-->>Frontend (resources.js): 500 Internal Server Error
        Frontend (resources.js)-->>User: Show "Failed to load resources" message
    end


# UPDATE



    participant User
    participant Frontend (form.js)
    participant Backend (Express API)
    participant Service
    participant PostgreSQL

    User->>Frontend (form.js): Edit resource and click save
    Frontend (form.js)->>Backend (Express API): PUT /api/resources/:id

    Note right of Frontend (form.js): Payload:\nresourceId\nresourceName\nresourceDescription\nresourcePrice\nresourcePriceUnit\nresourceAvailable

    Backend (Express API)->>Service: updateResource(id, data)
    Service->>PostgreSQL: UPDATE resources SET ...

    alt Success
        PostgreSQL-->>Service: Updated row
        Service-->>Backend (Express API): Updated resource
        Backend (Express API)-->>Frontend (form.js): 200 OK + JSON
        Frontend (form.js)-->>User: Updated resource displayed
    else Resource not found
        Backend (Express API)-->>Frontend (form.js): 404 Not Found
        Frontend (form.js)-->>User: Show error message
    end


# DELETE

    participant User
    participant Frontend (resources.js)
    participant Backend (Express API)
    participant Service
    participant PostgreSQL

    User->>Frontend (resources.js): Click delete resource
    Frontend (resources.js)->>Backend (Express API): DELETE /api/resources/:id

    Backend (Express API)->>Service: deleteResource(id)
    Service->>PostgreSQL: DELETE FROM resources WHERE id = ?

    alt Success
        PostgreSQL-->>Service: Row deleted
        Service-->>Backend (Express API): Success
        Backend (Express API)-->>Frontend (resources.js): 204 No Content
        Frontend (resources.js)-->>User: Resource removed from list
    else Resource not found
        Backend (Express API)-->>Frontend (resources.js): 404 Not Found
        Frontend (resources.js)-->>User: Show error message
    end

<?php

namespace App\Controller;

use App\Entity\Movie;
use App\Entity\People;
use App\Entity\Type;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class MovieController extends AbstractController
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;
    /**
     * @var Security
     */
    private $security;

    public function __construct(ManagerRegistry $doctrine, Security $security)
    {
        $this->security = $security;
        $this->doctrine = $doctrine;
    }

    /**
     * @Route("/movie", name="movie")
     */
    public function index(Request $request): Response
    {
        $user = $this->security->getUser();

        return $this->render(
            'movie/index.html.twig',
            [
                'operation' => $request->query->get('operation'),
                'peoples' => $this->getActorList(),
                'types' => $this->getTypeList(),
                'movies' => [null => 'undefined'] + $this->getMovies(),
                'user' => $user
            ]
        );
    }

    private function getTypeList(): Array
    {
        $repositoryType = $this->doctrine->getRepository(Type::class);
        return $repositoryType->findAllOnlyName();
    }

    private function getActorList(): Array
    {
        $repositoryActor = $this->doctrine->getRepository(People::class);
        return $repositoryActor->findAllOnlyName();
    }

    private function getMovies(): Array
    {
        $repositoryType = $this->doctrine->getRepository(Movie::class);
        return $repositoryType->findAllOnlyTitle();
    }
}
